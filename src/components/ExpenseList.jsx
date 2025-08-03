import moment from "moment";
import { Download, Mail, AlertCircle } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const ExpenseList = ({ 
    transactions, 
    onDelete, 
    onDownload, 
    onEmail,
    isEmailLoading = false,
    isDownloadLoading = false
}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">All Expenses</h5>
                <div className="flex items-center justify-end gap-2">
                    <button 
                        className="card-btn flex items-center gap-2" 
                        onClick={onEmail}
                        disabled={isEmailLoading || !transactions?.length}
                    >
                        {isEmailLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <Mail size={15} className="text-base" />
                                <span>Email</span>
                            </>
                        )}
                    </button>
                    <button 
                        className="card-btn flex items-center gap-2" 
                        onClick={onDownload}
                        disabled={isDownloadLoading || !transactions?.length}
                    >
                        {isDownloadLoading ? (
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
                {!transactions?.length ? (
                    <div className="col-span-2 flex flex-col items-center justify-center py-8 text-gray-500">
                        <AlertCircle size={48} className="mb-2" />
                        <p>No expense transactions found</p>
                    </div>
                ) : (
                    transactions.map((expense) => (
                        <TransactionInfoCard
                            key={expense.id}
                            title={expense.name}
                            icon={expense.icon}
                            date={moment(expense.date).format("Do MMM YYYY")}
                            amount={expense.amount}
                            type="expense"
                            onDelete={() => onDelete(expense.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpenseList;
