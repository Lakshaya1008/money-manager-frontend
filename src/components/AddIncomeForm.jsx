import { useEffect, useState } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const AddIncomeForm = ({ onAddIncome, categories, isSubmitting = false }) => {
    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: ''
    })


    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }))

    const handleChange = (key, value) => {
        setIncome({...income, [key]: value});
    }

    const handleAddIncome = async () => {
        await onAddIncome(income);
    }

    useEffect(() => {
        if (categories.length > 0 && !income.categoryId) {
            setIncome((prev) => ({...prev, categoryId: categories[0].id}))
        }
    }, [categories, income.categoryId]);

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input
                value={income.name}
                onChange={({target}) => handleChange('name', target.value)}
                label="Income Source"
                placeholder="e.g., Salary, Freelance, Bonus"
                type="text"
            />

            <Input
                label="Category"
                value={income.categoryId}
                onChange={({target}) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={income.amount}
                onChange={({target}) => handleChange('amount', target.value)}
                label="Amount"
                placeholder="e.g., 500.00"
                type="number"
            />

            <Input
                value={income.date}
                onChange={({target}) => handleChange('date', target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={handleAddIncome}
                    disabled={isSubmitting}
                    className="add-btn add-btn-fill flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span>Adding...</span>
                        </>
                    ) : (
                        <span>Add Income</span>
                    )}
                </button>
            </div>
        </div>
    )
}

export default AddIncomeForm;