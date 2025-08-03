import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import Dashboard from "../components/Dashboard.jsx";
import ExpenseOverview from "../components/ExpenseOverview.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Modal from "../components/Modal.jsx";
import AddExpenseForm from "../components/AddExpenseForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { Plus } from "lucide-react";

const Expense = () => {
    useUser();
    const navigate = useNavigate();
    const [expenseData, setExpenseData] = useState([]);
    const [categories, setCategories] = useState([]); // New state for expense categories
    const [loading, setLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [addingExpense, setAddingExpense] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Get All Expense Details
    const fetchExpenseDetails = async () => {
        if (loading) return; // Prevent multiple fetches if already loading

        setLoading(true);

        try {
            const response = await axiosConfig.get(
                `${API_ENDPOINTS.GET_ALL_EXPENSE}`
            );

            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense details:", error);
            toast.error("Failed to fetch expense details.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Expense Categories
    const fetchExpenseCategories = async () => {
        setCategoryLoading(true);
        try {
            const response = await axiosConfig.get(
                API_ENDPOINTS.CATEGORY_BY_TYPE("expense")
            );
            if (response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch expense categories:", error);
            toast.error("Failed to fetch expense categories.");
            throw error;
        } finally {
            setCategoryLoading(false);
        }
    };


    // Handle Add Expense
    const handleAddExpense = async (expense) => {
        const { name, categoryId, amount, date, icon } = expense;

        try {
            // Validation Checks
            if (!name?.trim()) {
                throw new Error("Name is required.");
            }

            if (!categoryId) {
                throw new Error("Category is required.");
            }

            if (!amount || isNaN(amount) || Number(amount) <= 0) {
                throw new Error("Amount should be a valid number greater than 0.");
            }

            if (!date) {
                throw new Error("Date is required.");
            }

            const today = new Date().toISOString().split('T')[0];
            if (date > today) {
                throw new Error('Date cannot be in the future');
            }

            setAddingExpense(true);
            await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
                name,
                categoryId,
                amount: Number(amount),
                date,
                icon,
            });

            toast.success("Expense added successfully!");
            await fetchExpenseDetails();
            setOpenAddExpenseModal(false);
        } catch (error) {
            console.error("Failed to add expense:", error);
            toast.error(error.message || "Failed to add expense.");
        } finally {
            setAddingExpense(false);
        } catch (error) {
            console.error(
                "Error adding expense:",
                error.response?.data?.message || error.message
            );
            toast.error(error.response?.data?.message || "Failed to add expense.");
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense details deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error deleting expense:",
                error.response?.data?.message || error.message
            );
            toast.error(error.response?.data?.message || "Failed to delete expense.");
        }
    };

    const handleDownloadExpenseDetails = async () => {
        if (!expenseData.length) {
            toast.error("No expense data to download");
            return;
        }

        try {
            setDownloadLoading(true);
            const response = await axiosConfig.get(
                API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
                {
                    responseType: "blob",
                }
            );

            const filename = "expense_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Expense details downloaded successfully!");
        } catch (error) {
            console.error("Error downloading expense details:", error);
            toast.error(error.response?.data?.message || "Failed to download expense details");
        } finally {
            setDownloadLoading(false);
        }
    };

    const handleEmailExpenseDetails = async () => {
        if (!expenseData.length) {
            toast.error("No expense data to email");
            return;
        }

        try {
            setEmailLoading(true);
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
            if(response.status === 200) {
                toast.success("Email sent successfully");
            }
        } catch (error) {
            console.error("Error emailing expense details:", error);
            toast.error(error.response?.data?.message || "Failed to email expense details");
        } finally {
            setEmailLoading(false);
        }
    }

    useEffect(() => {
        fetchExpenseDetails();
        fetchExpenseCategories(); // Fetch categories when component mounts
    }, []);

    return (
        <Dashboard activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <div className="">
                            <ExpenseOverview
                                transactions={expenseData}
                                onExpenseIncome={() => setOpenAddExpenseModal(true)}
                            />
                        </div>
                    )}

                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id });
                        }}
                        onDownload={handleDownloadExpenseDetails}
                        onEmail={handleEmailExpenseDetails}
                        isEmailLoading={emailLoading}
                        isDownloadLoading={downloadLoading}
                    />

                    <Modal
                        isOpen={openAddExpenseModal}
                        onClose={() => setOpenAddExpenseModal(false)}
                        title="Add Expense"
                    >
                        <AddExpenseForm
                            onAddExpense={handleAddExpense}
                            categories={categories}
                            isSubmitting={addingExpense}
                            isLoadingCategories={categoryLoading}
                        />
                    </Modal>

                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                        title="Delete Expense"
                    >
                        <DeleteAlert
                            content="Are you sure you want to delete this expense detail?"
                            onDelete={() => deleteExpense(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    );
};

export default Expense;