type HttpsUrl = `https://${string}`;
type MailtoUrl = `mailto:${string}`;

interface SocialChannel {
  readonly label: 'Instagram' | 'TikTok';
  readonly href: HttpsUrl;
}

interface ContactChannels {
  readonly email: {
    readonly address: string;
    readonly href: MailtoUrl;
    readonly projectHref: MailtoUrl;
  };
  readonly whatsapp: {
    readonly href: HttpsUrl;
  };
  readonly social: readonly SocialChannel[];
}

const emailAddress = 'godigitalveweb@gmail.com';
const projectSubject = 'Quiero%20conversar%20sobre%20mi%20proyecto';

export const CONTACT_CHANNELS = {
  email: {
    address: emailAddress,
    href: `mailto:${emailAddress}`,
    projectHref: `mailto:${emailAddress}?subject=${projectSubject}`,
  },
  whatsapp: {
    href: 'https://wa.me/message/UFU3OSZAUAYKK1',
  },
  social: [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/godigitalve?igsh=cTF5OHdlMjFmb3px&utm_source=qr',
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@godigital45?_r=1&_t=ZS-98Pof6VsQem',
    },
  ],
} as const satisfies ContactChannels;
