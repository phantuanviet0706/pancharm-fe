import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

type FileKind = 'image' | 'pdf' | 'other';

function guessFileKind(url?: string | null, mimeType?: string | null): FileKind {
	if (!url && !mimeType) return 'other';
	const mt = (mimeType || '').toLowerCase();
	if (mt.includes('image/')) return 'image';
	if (mt.includes('pdf')) return 'pdf';
	const ext = (url || '').split('?')[0].split('#')[0].split('.').pop()?.toLowerCase();
	if (ext && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
	if (ext === 'pdf') return 'pdf';
	return 'other';
}

export interface GenericPreviewDialogProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	url?: string | null;
	fileName?: string;
	mimeType?: string | null;
	actions?: React.ReactNode;
	children?: React.ReactNode;
}

export default function GenericPreviewDialog({
	open,
	onClose,
	title = 'Xem trước',
	url,
	fileName,
	mimeType,
	actions,
	children
}: GenericPreviewDialogProps) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const kind = guessFileKind(url, mimeType);

	const handleOpenNewTab = () => {
		if (url) window.open(url, '_blank', 'noopener,noreferrer');
	};

	const handleDownload = () => {
		if (!url) return;
		const a = document.createElement('a');
		a.href = url;
		if (fileName) a.download = fileName;
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		document.body.appendChild(a);
		a.click();
		a.remove();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
			<DialogTitle sx={{ pr: 6 }}>
				{title}
				<IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				{url ? (
					kind === 'image' ? (
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							<img
								src={url}
								alt={fileName || 'preview'}
								style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }}
							/>
						</Box>
					) : kind === 'pdf' ? (
						<Box sx={{ height: '75vh' }}>
							<object data={url} type="application/pdf" width="100%" height="100%">
								<iframe title="pdf-preview" src={url} width="100%" height="100%" />
							</object>
						</Box>
					) : (
						<Box sx={{ p: 2 }}>
							<p>Không thể xem trước loại tệp này.</p>
							<p style={{ wordBreak: 'break-all' }}>{fileName || url}</p>
						</Box>
					)
				) : (
					children || <Box sx={{ p: 2 }}>Không có tài nguyên để hiển thị.</Box>
				)}
			</DialogContent>

			<DialogActions>
				{actions}
				{url && (
					<>
						<Button onClick={handleOpenNewTab}>Mở tab mới</Button>
						{/* <Button onClick={handleDownload}>Tải xuống</Button> */}
					</>
				)}
				<Button variant="contained" onClick={onClose}>
					Đóng
				</Button>
			</DialogActions>
		</Dialog>
	);
}
