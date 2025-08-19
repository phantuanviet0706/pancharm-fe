import { TextField } from '@mui/material';
import { DEFAULT_USER, User } from 'api/userService';
import CommonDialog from 'components/Dialog/GenericDialog';
import { useFormHandler } from 'hooks/useFormHandler';
import { useEffect, useMemo } from 'react';

export const ACTIONS = ['create', 'update'] as const;
export type ActionType = (typeof ACTIONS)[number];

function isActionType(v: unknown): v is ActionType {
	return ACTIONS.includes(v as ActionType);
}
function normalizeAction(v: unknown, fallback: ActionType = 'create'): ActionType {
	return isActionType(v) ? (v as ActionType) : fallback;
}

interface UserFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<User>) => Promise<{ code: number; message: string }>;
	initialData?: User | null;
	onSuccess?: (code: number, message: string) => void;
	action?: ActionType;
}

type FormFieldsProps = {
	form: Partial<User>;
	setForm: (next: Partial<User>) => void;
};

type ChildProps = UserFormProps &
	FormFieldsProps & {
		handleSubmit: () => void;
		action: ActionType;
	};

function CreateUserForm({ open, onClose, initialData, form, setForm, handleSubmit }: ChildProps) {
	return (
		<CommonDialog
			open={open}
			title={initialData ? 'Edit User' : 'Create User'}
			onClose={onClose}
			maxWidth="md"
			actions={[
				{
					label: 'Close',
					variant: 'outlined',
					onClick: onClose,
					sx: { width: '50%' }
				},
				{
					label: 'Save',
					variant: 'contained',
					onClick: () => handleSubmit()
				}
			]}
		>
			<TextField
				label="Username *"
				fullWidth
				sx={{ mt: 2 }}
				value={form.username || ''}
				onChange={(e) => setForm({ ...form, username: e.target.value })}
			/>

			<TextField
				label="Password *"
				type="password"
				fullWidth
				sx={{ mt: 2 }}
				value={form.password || ''}
				onChange={(e) => setForm({ ...form, password: e.target.value })}
			/>
		</CommonDialog>
	);
}

function UpdateUserForm({ open, onClose, initialData, form, setForm, handleSubmit }: ChildProps) {
	return (
		<CommonDialog
			open={open}
			title={initialData ? 'Edit User' : 'Create User'}
			onClose={onClose}
			maxWidth="md"
			actions={[
				{
					label: 'Close',
					variant: 'outlined',
					onClick: onClose,
					sx: { width: '50%' }
				},
				{
					label: 'Save',
					variant: 'contained',
					onClick: () => handleSubmit()
				}
			]}
		>
			<TextField
				label="Username *"
				fullWidth
				sx={{ mt: 2 }}
				value={form.username || ''}
				onChange={(e) => setForm({ ...form, username: e.target.value })}
				disabled
			/>
		</CommonDialog>
	);
}

const RENDERERS = {
	create: CreateUserForm,
	update: UpdateUserForm
} satisfies Record<ActionType, React.FC<ChildProps>>;

export default function UserForm({ open, onClose, onSubmit, initialData, onSuccess, action = 'create' }: UserFormProps) {
	const { form, setForm, handleSubmit } = useFormHandler<User>(initialData ?? null, DEFAULT_USER, onSubmit, open);

	useEffect(() => {
		if (!open) return;
		if (initialData) {
			setForm(initialData);
		} else {
			setForm(DEFAULT_USER);
		}
	}, [open, initialData, setForm]);

	const safeAction = useMemo(() => normalizeAction(action, 'create'), [action]);

	const Renderer = useMemo(() => {
		const C = RENDERERS[safeAction];
		if (!C) {
			console.error('[UserForm] Unknown action:', action);
			return RENDERERS.create;
		}
		return C;
	}, [safeAction, action]);

	return (
		<Renderer
			open={open}
			onClose={onClose}
			onSubmit={onSubmit}
			initialData={initialData}
			onSuccess={onSuccess}
			action={action}
			form={form}
			setForm={setForm}
			handleSubmit={handleSubmit}
		/>
	);
}
