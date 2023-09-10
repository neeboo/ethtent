import React, { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from './ui/checkbox';

interface DialogDemoProps {
  available: boolean;
  openDialog: (value: boolean) => void;
}

interface DCAprop {
  amount?: number;
  rotationCount?: number;
  time?: number;
  currency?: string;
}

const DialogDemo: React.FC<DialogDemoProps> = ({ available, openDialog }) => {
  const [selectedRotation, setSelectedRotation] = useState<number | null>(null);
  const [selectedRotationId, setSelectedRotationId] = useState<number | null>(null);
  const [dca, setDCA] = useState<DCAprop | null>(null);
  const [commissionCharge, setCommissionCharge] = useState<number | null>(null);
  const [limitOrder, setLimitOrder] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * ONE_HOUR;

  const rotation = [
    { id: 1, label: '1 Hour', value: ONE_HOUR },
    { id: 2, label: '4 Hours', value: 4 * ONE_HOUR },
    { id: 3, label: '8 Hours', value: 8 * ONE_HOUR },
    { id: 4, label: '12 Hours', value: 12 * ONE_HOUR },
    { id: 5, label: 'Daily', value: ONE_DAY },
    { id: 6, label: 'Weekly', value: 7 * ONE_DAY },
    { id: 7, label: 'Bi-Weekly', value: 14 * ONE_DAY },
    { id: 8, label: 'Monthly', value: 30 * ONE_DAY }, // Approximate
  ];

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const handleRotationChange = (id: number) => {
    const rotationItem = rotation.find(item => item.id === id);
    if (rotationItem) {
      const nextRotationTime = Date.now() + rotationItem.value;
      setSelectedRotation(nextRotationTime);
    }
  };

  function submitDCA() {
    console.log('submitDCA');
  }

  useEffect(() => {
    if (open) {
      setCommissionCharge(0);
      setDCA(null);
      setSelectedRotationId(1);
      handleRotationChange(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!available}
          onClick={() => {
            openDialog(true);
            setOpen(true);
          }}
        >
          {available ? 'Create A Plan' : 'Coming Soon'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create Your Plan</DialogTitle>
        </DialogHeader>
        <div className=" grid grid-cols-2 bg-white">
          <div className="col-span-1 p-4">
            <div className="flex justify-between">
              <div className="text-md font-bold text-black">ETH</div>
              <div className="text-md font-normal text-black">100%</div>
            </div>
            <div className="mt-6">
              <div className="mb-1 text-xs font-normal text-black">Amount Per Investment</div>
              <Input
                // value={open ? dca?.amount : 0}
                onChange={e => {
                  setDCA({ ...dca, amount: parseInt(e.target.value) });
                  setCommissionCharge(parseInt(e.target.value) * 0.003);
                }}
              ></Input>
            </div>
            <div className="mt-6">
              <div className="mb-1 text-xs font-normal text-black">Number of Rotation</div>
              <Input
                // value={open ? dca?.rotationCount : 0}
                onChange={e => {
                  setDCA({ ...dca, rotationCount: parseInt(e.target.value) });
                }}
              ></Input>
            </div>
            <div className="mt-6">
              <div className="mt-6 grid grid-cols-4 gap-2">
                <div className="col-span-4 mb-1 text-xs font-normal text-black">Rotate Period</div>
                {rotation.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-center w-[100px] h-[30px] rounded-sm cursor-pointer 
                            ${item.id === selectedRotationId ? 'bg-green-500' : 'bg-zinc-300'}`}
                    onClick={() => {
                      setSelectedRotationId(item.id); // Update the selected ID when clicked
                      handleRotationChange(item.id); // Existing function to change rotation
                    }}
                  >
                    <span className="text-xs font-normal text-black">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-2">
              <Checkbox
                onClick={() => {
                  setLimitOrder(!limitOrder);
                }}
                id="terms"
              />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Limit Order
              </label>
            </div>
            {limitOrder ? (
              <div className="mt-6">
                <div className="mb-1 text-xs font-normal text-black">Limit Price</div>
                <Input
                  // value={open ? dca?.amount : 0}
                  onChange={e => {
                    setDCA({ ...dca, amount: parseInt(e.target.value) });
                    setCommissionCharge(parseInt(e.target.value) * 0.003);
                  }}
                ></Input>
              </div>
            ) : null}
          </div>

          <div className="col-span-1 bg-zinc-300 p-4 rounded-lg">
            <div className="mb-2 text-lg font-bold text-black">Summary</div>
            <div className="grid grid-rows-4 gap-2">
              <div className="flex justify-between text-xs font-normal text-black">
                <div>Amount Per Investment</div>
                <div>{dca?.amount ? dca?.amount : '--'} USDT</div>
              </div>
              <div className="flex justify-between text-xs font-normal text-black">
                <div>Created Time</div>
                <div>{formatDate(Date.now())}</div>
              </div>
              <div className="flex justify-between text-xs font-normal text-black">
                <div>Initial Invest Time</div>
                <div>{selectedRotation ? formatDate(selectedRotation) : 'N/A'}</div>
              </div>
              <div className="flex justify-between text-xs font-normal text-black">
                <div>Commission (0.3%)</div>
                <div>{dca?.amount ? commissionCharge : '--'}</div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submitDCA}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDemo;
