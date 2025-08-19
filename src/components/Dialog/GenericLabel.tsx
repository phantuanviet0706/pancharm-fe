import React from 'react';

interface GenericLabelProps {
	label: string;
	value: string;
	icon?: React.ReactNode;
	truncate?: boolean;
	customClass?: string;
}

export default function GenericLabel({ icon, label, value, truncate = false, customClass = '' }: GenericLabelProps) {
	return (
		<div className={'item ' + customClass}>
			<div className="label">
				<span className="item-icons">{icon}</span>
				<span className="item-content">{label}</span>
			</div>
			<div className="value">
				<span className={truncate ? 'truncate' : ''}>{value || '—'}</span>
			</div>
		</div>
	);
}
