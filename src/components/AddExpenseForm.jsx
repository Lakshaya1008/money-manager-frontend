import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const AddExpenseForm = ({ onAddExpense, categories, isSubmitting = false, isLoadingCategories = false }) => {
    const [expense, setExpense] = useState({
        name: "",
        categoryId: "",
        amount: "",
        date: "",
        icon: "",
    });

    // Effect to set a default category if categories are loaded and none is selected
    useEffect(() => {
        if (categories && categories.length > 0 && !expense.categoryId) {
            // Automatically select the first category as default if none is chosen
            setExpense((prev) => ({ ...prev, categoryId: categories[0].id })); // Use categories[0].id for MySQL
        }
    }, [categories, expense.categoryId]);

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value }); // Changed setIncome to setExpense

    // Map categories to the format expected by the reusable Input dropdown
    const categoryOptions = categories.map((cat) => ({
        value: cat.id, // Correct for MySQL 'id'
        label: `${cat.name}`, // Display icon and name in dropdown
    }));

    return (
        <div>
            <EmojiPickerPopup
                icon={expense.icon} // Uses expense.icon now
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Income Source"
                placeholder="e.g., Electricity, Wifi"
                type="text"
            />

            {/* Replaced Input for 'Category' text with a dropdown for 'Category' */}
            <Input
                label="Category"
                value={expense.categoryId}
                onChange={({ target }) => handleChange("categoryId", target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={expense.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="e.g., 150.00"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill flex items-center gap-2"
                    onClick={() => onAddExpense(expense)}
                    disabled={isSubmitting || isLoadingCategories}
                >
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span>Adding Expense...</span>
                        </>
                    ) : (
                        <span>Add Expense</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;