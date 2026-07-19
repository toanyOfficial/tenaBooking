'use client';

import { useState } from 'react';

type AddressNoticeCopy = {
  title: string;
  koreanAddress: string;
  englishAddress: string;
  mapLabel: string;
  copyLabel: string;
  copiedLabel: string;
};

const googleMapsUrl = 'https://maps.app.goo.gl/uVPrtximE3W7qohn9';

export function AccommodationAddressNotice({ copy }: { copy: AddressNoticeCopy }) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyAddress = async (address: string) => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    window.setTimeout(() => setCopiedAddress((current) => (current === address ? null : current)), 1800);
  };

  const addresses = [copy.koreanAddress, copy.englishAddress];

  return (
    <aside className="independentNotice addressNotice">
      <div className="addressNoticeHeader">
        <h2>{copy.title}</h2>
        <a className="mapIconLink" href={googleMapsUrl} target="_blank" rel="noopener noreferrer" aria-label={copy.mapLabel} title={copy.mapLabel}>
          <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            <path d="M12 2.25c-3.31 0-6 2.58-6 5.76 0 4.03 4.47 9.62 5.58 10.93a.55.55 0 0 0 .84 0C13.53 17.63 18 12.04 18 8.01c0-3.18-2.69-5.76-6-5.76Zm0 8.05a2.22 2.22 0 1 1 0-4.44 2.22 2.22 0 0 1 0 4.44Z" />
            <path d="M5 20.25h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1 0-1.5Z" />
          </svg>
        </a>
      </div>
      <div className="addressList">
        {addresses.map((address) => (
          <div className="addressRow" key={address}>
            <p>{address}</p>
            <button type="button" className="copyAddressButton" onClick={() => copyAddress(address)}>
              {copiedAddress === address ? copy.copiedLabel : copy.copyLabel}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
