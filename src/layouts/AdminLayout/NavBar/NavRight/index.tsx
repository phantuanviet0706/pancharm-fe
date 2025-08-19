import { Link } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown, Form } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

// assets
import defaultAvatar from 'assets/images/user/default-avatar.jpg';
import { User } from '../../../../api/userService';
import { RoleTypes } from 'constants/roleTypes';
import { logout } from 'api/authService';

// -----------------------|| NAV RIGHT ||-----------------------//

interface NavRightProps {
	user?: User;
}

export default function NavRight({ user }: NavRightProps) {
	const roles = user?.roles || [];
	let isAdmin = false;

	roles.forEach((role) => {
		if (role.name === RoleTypes.SUPER_ADMIN || role.name === RoleTypes.ADMIN) {
			isAdmin = true;
			return;
		}
	});

	const handleLogout = async () => {
		try {
			const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
			const res = await logout({ token });
			if (res?.code !== 1) {
				throw res?.message ?? 'Logout Failed';
			}
			return;
		} catch (err: any) {
			console.error('Failed to logout:', err);
			throw err;
		}
	};

	return (
		<ListGroup as="ul" bsPrefix=" " className="list-unstyled">
			{/* <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
				<Dropdown>
					<Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0">
						<i className="material-icons-two-tone">search</i>
					</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu-end pc-h-dropdown drp-search">
						<Form className="px-3">
							<div className="form-group mb-0 d-flex align-items-center">
								<FeatherIcon icon="search" />
								<Form.Control type="search" className="border-0 shadow-none" placeholder="Search here. . ." />
							</div>
						</Form>
					</Dropdown.Menu>
				</Dropdown>
			</ListGroup.Item> */}
			<ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
				<Dropdown className="drp-user">
					<Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0 user-name">
						<img src={user?.avatar ?? defaultAvatar} alt="userimage" className="user-avatar" />
						<span>
							<span className="user-name">{user?.fullname ?? user?.username}</span>
							<span className="user-desc">Administrator</span>
						</span>
					</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
						{/* <Dropdown.Header className="pro-head">
							<h5 className="text-overflow m-0">
								<span className="badge bg-light-success">Pro</span>
							</h5>
						</Dropdown.Header> */}
						<Link to={'/users/'} className="dropdown-item">
							<i className="feather icon-user" /> Profile
						</Link>
						{/* <Link to="/auth/signin-2" className="dropdown-item">
							<i className="feather icon-lock" /> Lock Screen
						</Link> */}
						<Link to="#" className="dropdown-item" onClick={handleLogout}>
							<i className="material-icons-two-tone">chrome_reader_mode</i> Logout
						</Link>
					</Dropdown.Menu>
				</Dropdown>
			</ListGroup.Item>
		</ListGroup>
	);
}
