import { Box, Button, Modal, TextField } from "@mui/material";
import { Permission } from "api/permissionService";
import { useEffect, useState } from "react";

interface PermissionFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Permission>) => void
    initialData?: Permission | null;
}

export default function PermissionForm({ open, onClose, onSubmit, initialData }: PermissionFormProps) {
    const [form, setForm] = useState<Partial<Permission>>({ name: '', description: '' });

    useEffect(() => {
        if (initialData) setForm(initialData);
        else setForm({ name: '', description: '' });
    }, [initialData]);

    const handleSubmit = () => {
        onSubmit(form);
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 3, background: '#fff', width: 400, margin: '10% auto', borderRadius: 2 }}>
                <h3>{ initialData ? 'Edit Permission' : 'Create Permission' }</h3>
                <TextField
                    label="Name"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={form.name || ''}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />
                <TextField
                    label="Description"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={form.description || ''}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                />
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>Save</Button>
            </Box>
        </Modal>
    )
}