import { lazy } from 'react';

import AdminLayout from 'layouts/AdminLayout';
import GuestLayout from 'layouts/GuestLayout';

const DashboardSales = lazy(() => import('../views/dashboard/DashSales/index'));

const Typography = lazy(() => import('../views/ui-elements/basic/BasicTypography'));
const Color = lazy(() => import('../views/ui-elements/basic/BasicColor'));

const FeatherIcon = lazy(() => import('../views/ui-elements/icons/Feather'));
const FontAwesome = lazy(() => import('../views/ui-elements/icons/FontAwesome'));
const MaterialIcon = lazy(() => import('../views/ui-elements/icons/Material'));

const Login = lazy(() => import('../views/auth/Login'));
const Register = lazy(() => import('../views/auth/register'));

const Sample = lazy(() => import('../views/sample'));

const PermissionPage = lazy(() => import('../views/permissions/PermissionPage'));
const RolePage = lazy(() => import('../views/roles/RolePage'));
const CategoryPage = lazy(() => import('../views/categories/CategoryPage'));
const ProductPage = lazy(() => import('../views/products/ProductPage'));
const CompanyPage = lazy(() => import('../views/company/CompanyPage'));
const UserPage = lazy(() => import('../views/users/UserPage'));

const MainRoutes = {
	path: '/',
	children: [
		{
			path: '/',
			element: <AdminLayout />,
			children: [
				{
					path: '/dashboard/sales',
					element: <DashboardSales />
				},
				{
					path: '/typography',
					element: <Typography />
				},
				{
					path: '/color',
					element: <Color />
				},
				{
					path: '/icons/Feather',
					element: <FeatherIcon />
				},
				{
					path: '/icons/font-awesome-5',
					element: <FontAwesome />
				},
				{
					path: '/icons/material',
					element: <MaterialIcon />
				},

				{
					path: '/sample-page',
					element: <Sample />
				},

				{
					path: '/permissions',
					element: <PermissionPage />
				},

				{
					path: '/roles',
					element: <RolePage />
				},

				{
					path: '/categories',
					element: <CategoryPage />
				},

				{
					path: '/products',
					element: <ProductPage />
				},

				{
					path: '/company',
					element: <CompanyPage />
				},

				{
					path: '/users',
					element: <UserPage />
				}
			]
		},
		{
			path: '/',
			element: <GuestLayout />,
			children: [
				{
					path: '/login',
					element: <Login />
				},
				{
					path: '/register',
					element: <Register />
				}
			]
		}
	]
};

export default MainRoutes;
