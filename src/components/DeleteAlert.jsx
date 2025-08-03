import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";

const DeleteAlert = ({content, onDelete}) => {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        }finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    type="button"
                    className="add-btn add-btn-fill flex items-center gap-2">
                    {loading ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span>Deleting...</span>
                        </>
                    ): (
                        <>
                            <span>Delete</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert;