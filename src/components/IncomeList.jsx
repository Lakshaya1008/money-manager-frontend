import { Download, Mail } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import moment from "moment";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

const IncomeList = ({ transactions, onDelete, onDownload, onEmail }) => {
    const [emailLoading, setEmailLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const handleEmail = async () => {
        setEmailLoading(true);
        try {
            await onEmail();
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        } finally {
            setEmailLoading(false);
        }
    }

    const handleDownload = async () => {
        setDownloadLoading(true);
        try {
            await onDownload();
        } catch (error) {
            console.error('Failed to download:', error);
            throw error;
        } finally {
            setDownloadLoading(false);
        }
    }
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income Sources</h5>
                <div className="flex items-center justify-end gap-2">
                    <button 
                        disabled={emailLoading || downloadLoading} 
                        className="card-btn flex items-center gap-2" 
                        onClick={handleEmail}
                    >
                        {emailLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span>Emailing...</span>
                            </>
                        ) : (
                            <>
                                <Mail size={15} className="text-base" />
                                <span>Email</span>
                            </>
                        )}
                    </button>
                    <button 
                        disabled={emailLoading || downloadLoading} 
                        className="card-btn flex items-center gap-2" 
                        onClick={handleDownload}
                    >
                        {downloadLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span>Downloading...</span>
                            </>
                        ) : (
                            <>
                                <Download size={15} className="text-base" />
                                <span>Download</span>
                            </>
                        )}

                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {transactions?.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                        No income transactions found
                    </div>
                ) : (
                    transactions?.map((income) => (
                    <TransactionInfoCard
                        key={income.id}
                        title={income.name}
                        icon={income.icon}
                        date={moment(income.date).format('Do MMM YYYY')}
                        amount={income.amount}
                        type="income"
                        onDelete={() => onDelete(income.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default IncomeList;