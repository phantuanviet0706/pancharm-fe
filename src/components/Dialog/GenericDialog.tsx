import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface DialogAction {
	label: string;
	onClose: () => void;
	variant?: 'text' | 'outlined' | 'contained';
	color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
	disabled?: boolean;
	sx?: React.CSSProperties | any;
}

interface GenericDialogProps {
	open: boolean;
	title: string;
	children: React.ReactNode;
	actions?: DialogAction[];
	onClose: () => void;
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function CommonDialog({ open, title, children, actions = [], onClose, maxWidth = 'sm' }: GenericDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} scroll="body">
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{children}</DialogContent>

			{actions.length > 0 && (
				<DialogActions sx={{ px: 3, pb: 2 }}>
					{actions.map((action, idx) => (
						<Button
							key={idx}
							variant={action.variant || 'contained'}
							color={action.color || 'primary'}
							onClick={action.onClick}
							disabled={action.disabled}
							sx={action.sx}
						>	
							{action.label}
						</Button>
					))}
				</DialogActions>
			)}
		</Dialog>
	);
}
