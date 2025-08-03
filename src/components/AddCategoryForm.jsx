import { useEffect, useState } from "react";
import Input from "./Input.jsx";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing, isSubmitting }) => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    })


    useEffect(() => {
        if (isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        } else {
            setCategory({name: "", type: "income", icon: ""});
        }
    }, [isEditing, initialCategoryData]);

    const categoryTypeOptions = [
        {value: "income", label: "Income"},
        {value: "expense", label: "Expense"},
    ]

    const handleChange = (key, value) => {
        setCategory({...category, [key]: value})
    }

    const handleSubmit = async () => {
        await onAddCategory(category);
    }
    return (
        <div className="p-4">

            <EmojiPickerPopup
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={({target}) => handleChange("name", target.value)}
                label="Category Name"
                placeholder="e.g., Freelance, Salary, Groceries"
                type="text"
            />

            <Input
                label="Category Type"
                value={category.type}
                onChange={({target}) => handleChange("type", target.value)}
                isSelect={true}
                options={categoryTypeOptions}
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="add-btn add-btn-fill flex items-center gap-2">
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span>{isEditing ? "Updating..." : "Adding..."}</span>
                        </>
                    ): (
                        <>
                            <span>{isEditing ? "Update Category" : "Add Category"}</span>
                        </>
                    )}
                </button>
            </div>
        </div>

    )
}

export default AddCategoryForm;