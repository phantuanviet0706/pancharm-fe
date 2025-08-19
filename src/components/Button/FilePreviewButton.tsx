import * as React from 'react';
import { Button } from '@mui/material';
import GenericPreviewDialog from 'components/Dialog/GenericPreviewDialog';

export default function FilePreviewButton({
	url,
	label = 'Xem tệp',
	title,
	fileName,
	mimeType,
	startIcon
}: {
	url?: string | null;
	label?: string;
	title?: string;
	fileName?: string;
	mimeType?: string | null;
	startIcon?: React.ReactNode;
}) {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<Button variant="outlined" startIcon={startIcon} onClick={() => setOpen(true)} disabled={!url}>
				{label}
			</Button>
			<GenericPreviewDialog
				open={open}
				onClose={() => setOpen(false)}
				url={url ?? undefined}
				title={title || label}
				fileName={fileName}
				mimeType={mimeType}
			/>
		</>
	);
}
