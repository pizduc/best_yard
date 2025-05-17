
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserAgreement from '../pages/Documents/UserAgreement';

interface UserAgreementDialogProps {
  children: React.ReactNode;
}

const UserAgreementDialog = ({ children }: UserAgreementDialogProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Пользовательское соглашение</DialogTitle>
        </DialogHeader>
        <UserAgreement />
      </DialogContent>
    </Dialog>
  );
};

export default UserAgreementDialog;
