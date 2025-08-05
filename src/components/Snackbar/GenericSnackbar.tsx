import { Alert, Snackbar } from '@mui/material';
import React from 'react';

interface GenericSnackbarProps {
	code?: number;
	message?: string;
	onClose: () => void;
	autoHideDuration?: number;
	anchorOrigin?: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'right' | 'center';
	};
}

export default function GenericSnackbar({
	code,
	message,
	onClose,
	autoHideDuration = 3000,
	anchorOrigin = { vertical: 'top', horizontal: 'center' }
}: GenericSnackbarProps) {
	const open = !!message;
	const serverity = code === 1 ? 'success' : 'error';

	return (
		<Snackbar open={open} autoHideDuration={autoHideDuration} anchorOrigin={anchorOrigin} onClose={onClose}>
			<Alert onClose={onClose} severity={serverity} variant="filled" sx={{ width: '100%' }}>
				{message}
			</Alert>
		</Snackbar>
	);
}
