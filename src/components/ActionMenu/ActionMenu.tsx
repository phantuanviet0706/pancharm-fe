import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ActionItem {
	label: string;
	onClick: () => void;
	color?: string;
	icon?: React.ReactNode;
}

interface ActionMenuProps {
	actions: ActionItem[];
}

export default function ActionMenu({ actions }: ActionMenuProps) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);

	return (
		<>
			<IconButton onClick={handleClick}>
				<MoreVertIcon />
			</IconButton>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{actions.map((action, index) => (
					<MenuItem
						key={index}
						onClick={() => {
							handleClose();
							action.onClick();
						}}
						style={action.color ? { color: action.color } : {}}
					>
						{action.icon && <span style={{ marginRight: 8 }}>{action.icon}</span>}
						{action.label}
					</MenuItem>
				))}
			</Menu>
		</>
	);
}
