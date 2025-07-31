export interface Column<T> {
	key: keyof T | string;
	label: string;
	render?: (row: T) => React.ReactNode;
	width?: string;
	align?: 'left' | 'right' | 'center';
	headerStyle?: React.CSSProperties;
	cellStyle?: React.CSSProperties;
}

interface GenericTableProps<T> {
	data: T[];
	columns: Column<T>[];
	rowKey: (row: T) => string | number;
	maxHeight?: number | string;
}

export default function GenericTable<T>({ data, columns, rowKey, maxHeight = 400 }: GenericTableProps<T>) {
	if (!data || data.length == 0) return <p>No data found.</p>;

	const headerStyle = {
		padding: '12px',
		textAlign: 'left' as const,
		backgroundColor: '#f9f9f9',
		fontWeight: 600,
		borderBottom: '1px solid #ddd'
	};

	const cellStyle = {
		padding: '12px',
		borderBottom: '1px solid #eee',
		backgroundColor: '#eee'
	};

	return (
		<div style={{ border: '1px solid #ddd', borderRadius: 6, marginTop: 20 }}>
			<table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
				<thead>
					<tr>
						{columns.map((col, idx) => (
							<th
								key={idx}
								style={{
									...headerStyle,
                                    ...col.headerStyle,
									width: col.width || 'auto',
									textAlign: col.align || 'left'
								}}
							>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
			</table>
			<div style={{ maxHeight, overflowY: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
					<tbody>
						{data.map((row) => (
							<tr key={rowKey(row)}>
								{columns.map((col, idx) => (
									<td
										key={idx}
										style={{
											...cellStyle,
                                            ...col.cellStyle,
											textAlign: col.align || 'left',
											width: col.width || 'auto'
										}}
									>
										{col.render ? col.render(row) : (row[col.key as keyof T] as any)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
