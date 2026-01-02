import AccountContent from './AccountContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | LUNEL Beauty',
  description: 'Manage your LUNEL Beauty account, view your order history, and update your profile settings.',
};

export default function AccountPage() {
  return <AccountContent />;
}
