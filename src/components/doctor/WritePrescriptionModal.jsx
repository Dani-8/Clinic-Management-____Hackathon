// src/components/doctor/WritePrescriptionModal.jsx
import { Modal } from '../common/Modal';

export default function WritePrescriptionModal({
    isOpen,
    onClose,
    patient,
    notes,
    setNotes,
    onSave,
    userRole
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Clinical Record: ${patient?.name}`}>
            <div className="space-y-6">
                {/* paste your modal content here */}
            </div>
        </Modal>
    );
}