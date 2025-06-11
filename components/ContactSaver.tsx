'use client';
import React from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface Props {
  text: string;
}
function extractContactDetails(text: string) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  let name = '';
  let phone = '';
  let email = '';
  let company = '';

  const jobTitles = [
    'manager', 'director', 'engineer', 'developer', 'designer', 'consultant',
    'analyst', 'officer', 'president', 'ceo', 'cto', 'cfo', 'founder',
    'co-founder', 'lead', 'head', 'managing',
  ];

  const phoneRegex = /(\+?\d[\d\s\-()]{7,}\d)/;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const websiteRegex = /^www\./i;
  const addressKeywords = ['road', 'street', 'avenue', 'lane', 'city', 'village', 'pune', 'shop', 'opp', 'gate', 'bldg', 'floor', 'india', 'zip', 'postal', 'tal', 'dist'];

  // Get email and phone
  for (const line of lines) {
    if (!email) {
      const emailMatch = line.match(emailRegex);
      if (emailMatch) email = emailMatch[0];
    }
    if (!phone) {
      const phoneMatch = line.match(phoneRegex);
      if (phoneMatch) phone = phoneMatch[0];
    }
  }

  // Guess name from first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    const words = line.split(' ');

    const isAddress = addressKeywords.some((k) => lower.includes(k));
    const capitalizedWords = words.filter((w) =>
      /^[A-Z][a-z]+$/.test(w) || /^[A-Z]+$/.test(w)
    );

    if (!isAddress && capitalizedWords.length >= 2 && !phoneRegex.test(line) && !emailRegex.test(line)) {
      name = line;
      break;
    }
  }

  // Fallback: infer name from job title
  if (!name) {
    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      if (jobTitles.some((jt) => lower.includes(jt))) {
        const above = lines[i - 1];
        if (above) {
          const words = above.split(' ');
          const validWords = words.filter((w) =>
            /^[A-Z][a-z]+$/.test(w) || /^[A-Z]\.$/.test(w) || /^[A-Z]+$/.test(w)
          );
          if (validWords.length >= 2) {
            name = above;
          }
        }
        break;
      }
    }
  }

  // Guess company name — ignore numeric and address lines
  const emailDomain = email ? email.split('@')[1]?.split('.')[0] : '';
  const possibleCompanies = lines.filter((line) => {
    const lower = line.toLowerCase();
    return (
      !phoneRegex.test(line) &&
      !emailRegex.test(line) &&
      !websiteRegex.test(line) &&
      line !== name &&
      !jobTitles.some((jt) => lower.includes(jt)) &&
      isNaN(Number(line)) &&
      !addressKeywords.some((k) => lower.includes(k)) &&
      (
        /inc|corp|llc|ltd|company|technologies|solutions|studio|group|media|agency|courier/i.test(line) ||
        line === line.toUpperCase() ||
        (emailDomain && lower.includes(emailDomain))
      )
    );
  });

  if (possibleCompanies.length > 0) {
    company = possibleCompanies[0];
  } else if (emailDomain) {
    company = emailDomain.charAt(0).toUpperCase() + emailDomain.slice(1);
  }

  return { name, phone, email, company };
}



function downloadVCard({
  name,
  phone,
  email,
  company,
}: {
  name: string;
  phone: string;
  email: string;
  company: string;
}) {
  const vCard = `
BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
END:VCARD
  `.trim();

  const blob = new Blob([vCard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name || 'contact'}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const ContactSaver: React.FC<Props> = ({ text }) => {
  const { name, phone, email, company } = extractContactDetails(text);

  const saveToFirestore = async () => {
    try {
      await addDoc(collection(db, 'contacts'), {
        name,
        phone,
        email,
        company,
        createdAt: new Date(),
      });
      alert('Contact saved to Firestore!');
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact.');
    }
  };
  if (!name && !phone && !email) return null;

  return (
    <div className="mt-4 space-y-2">
      <h3 className="font-semibold text-gray-700">Extracted Contact:</h3>
      <ul className="text-sm text-gray-600">
        <li>
          <strong>Name:</strong> {name || 'Not Found'}
        </li>
        <li>
          <strong>Phone:</strong> {phone || 'Not Found'}
        </li>
        <li>
          <strong>Email:</strong> {email || 'Not Found'}
        </li>
        <li>
          <strong>Company:</strong> {company || 'Not Found'}
        </li>
      </ul>
      <button
        onClick={() => downloadVCard({ name, phone, email, company })}
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Save to Contacts
      </button>
      <button
          onClick={saveToFirestore}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save to Firestore
        </button>
    </div>
  );
};

export default ContactSaver;