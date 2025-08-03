import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import { Plus } from "lucide-react";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import IncomeOverview from "../components/IncomeOverview.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Income = () => {
    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [addingIncome, setAddingIncome] = useState(false);

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Fetch income details from the API
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
               setIncomeData(response.data);
            }
        } catch(error) {
            console.error('Failed to fetch income details:', error);
            let errorMessage = "Failed to fetch income details";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "Unable to reach the server. Please check your connection.";
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    // Fetch categories for income
    const fetchIncomeCategories = async () => {
        setCategoryLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE("income"));
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch(error) {
            console.error('Failed to fetch income categories:', error);
            let errorMessage = "Failed to fetch income categories";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "Unable to reach the server. Please check your connection.";
            }
            toast.error(errorMessage);
        } finally {
            setCategoryLoading(false);
        }
    }

    //save the income details
    const handleAddIncome = async (income) => {
        const {name, amount, date, icon, categoryId} = income;

        try {
            //validation
            if (!name.trim()) {
                throw new Error("Please enter a name");
            }

            if (!amount || isNaN(amount) || Number(amount) <= 0) {
                throw new Error("Amount should be a valid number greater than 0");
            }

            if (!date) {
                throw new Error("Please select a date");
            }

            const today = new Date().toISOString().split('T')[0];
            if (date > today) {
                throw new Error('Date cannot be in the future');
            }

            if (!categoryId) {
                throw new Error("Please select a category");
            }

            setAddingIncome(true);
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId,
            });

            if (response.status === 201) {
                toast.success("Income added successfully");
                setOpenAddIncomeModal(false);
                toast.success("Income added successfully");
                fetchIncomeDetails();
                fetchIncomeCategories();
            }
        }catch(error){
            console.log('Error adding income', error);
            toast.error(error.response?.data?.message || "Failed to adding income");
        }
    }

    //delete income details
    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("Income deleted successfully");
            fetchIncomeDetails();
        }catch(error) {
            console.log('Error deleting income', error);
            toast.error(error.response?.data?.message || "Failed to delete income");
        }
    }

    const handleDownloadIncomeDetails = async() => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, {responseType: "blob"});
            let filename = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Download income details successfully");
        }catch(error) {
            console.error('Error downloading income details:', error);
            toast.error(error.response?.data?.message || "Failed to download income");
        }
    }

    const handleEmailIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
            if (response.status === 200) {
                toast.success("Income details emailed successfully");
            }
        }catch(error) {
            console.error('Error emailing income details:', error);
            toast.error(error.response?.data?.message || "Failed to email income");
        }
    }

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories()
    }, []);

    return (
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : (
                            <IncomeOverview transactions={incomeData} onAddIncome={() => !categoryLoading && setOpenAddIncomeModal(true)} />
                        )}
                    </div>

                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                        onDownload={handleDownloadIncomeDetails}
                        onEmail={handleEmailIncomeDetails}
                    />

                    {/* Add Income Modal */}
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => !addingIncome && setOpenAddIncomeModal(false)}
                        title="Add Income"
                    >
                        {categoryLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : (
                            <AddIncomeForm
                                onAddIncome={(income) => handleAddIncome(income)}
                                categories={categories}
                                isSubmitting={addingIncome}
                            />
                        )}
                    </Modal>

                    {/* Delete Income Modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Delete Income"
                    >
                        <DeleteAlert
                            content="Are you sure want to delete this income details?"
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;