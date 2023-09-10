import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DialogDemoProps {
    available: boolean;
    openDialog: (value: boolean) => void;
}

const DialogDemo: React.FC<DialogDemoProps> = ({ available, openDialog }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className={available ? '' : "disable"} onClick={() => openDialog(true)}>
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
                            <div className="text-xs font-normal text-black">ETH</div>
                            <div className="text-xs font-normal text-black">100%</div>
                        </div>
                        <div className="mt-6">
                            <div className="mb-1 text-xs font-normal text-black">Amount Per Investment</div>
                            <Input></Input>
                        </div>
                        <div className="mt-6">
                            <div className="mt-6 grid grid-cols-4 gap-2">
                                <div className="col-span-4 mb-1 text-xs font-normal text-black">Rotate Period</div>
                                {['Daily', 'Bi-Weekly', '1 Hour', '8 Hours', 'Weekly', 'Monthly', '4 Hours', '12 Hours'].map((label, index) => (
                                    <div key={index} className="flex items-center justify-center w-[100px] h-[30px] bg-zinc-300 rounded-sm">
                                        <span className="text-xs font-normal text-black">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="col-span-1 bg-zinc-300 p-4 rounded-lg">
                        <div className="mb-2 text-xs font-normal text-black">Summary</div>
                        <div className="grid grid-rows-4 gap-2">
                            <div className="flex justify-between text-xs font-normal text-black">
                                <div>Amount Per Investment</div>
                                <div>100 USDT</div>
                            </div>
                            <div className="flex justify-between text-xs font-normal text-black">
                                <div>Initial Invest Time</div>
                                <div>Time.now</div>
                            </div>
                            <div className="flex justify-between text-xs font-normal text-black">
                                <div>Created Time</div>
                                <div>Time.now</div>
                            </div>
                            <div className="flex justify-between text-xs font-normal text-black">
                                <div>Commission (0.3%)</div>
                                <div>0.3 USDT</div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default DialogDemo