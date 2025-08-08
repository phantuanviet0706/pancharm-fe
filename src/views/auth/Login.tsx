import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Auth/AuthLayout';
import { icons } from '../../assets/icons/icons';
import { login } from 'api/authService';

import { useContext, useState } from 'react';
import { ConfigContext } from '../../contexts/ConfigContext';

import background from 'assets/images/background.jpg';

export default function SignIn1() {
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => setShowPassword(!showPassword);

	const [rememberMe, setRememberMe] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();

	const { state } = useContext(ConfigContext);

	const handleLogin = async () => {
		try {
			const res = await login({ username, password, remember: rememberMe });

			if (res?.code === 1 && res?.result) {
				const result = res.result;
				if (rememberMe) {
					localStorage.setItem('token', result.token);
				} else {
					sessionStorage.setItem('token', result.token);
				}

				navigate('/');
			}

			return { code: res?.code, message: res?.message };
		} catch (err) {
			return {
				code: -1,
				message: err?.response?.data?.message || err.message
			};
		}
	};

	return (
		<AuthLayout imgSrc={background} formPosition="left">
			<div className="login-wrapper">
				<div className="flex-space" />

				<div className="login-form">
					<div className="back-link">
						<Link to="/">{icons.back} Quay trở lại trang chủ</Link>
					</div>

					<div className="logo-block">{icons.pancharm}</div>

					<h2>Đăng nhập</h2>

					<div className="form-group">
						<input
							name="username"
							type="text"
							placeholder="Tài khoản"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className="form-group password-field">
						<input
							name="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="Mật khẩu"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span onClick={togglePasswordVisibility} className="toggle-password">
							{showPassword ? icons.eyeOpen : icons.eyeClosed}
						</span>
					</div>

					<label className="form-remember">
						<input name="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
						Ghi nhớ đăng nhập
					</label>

					<button className="login-button" onClick={handleLogin}>
						Đăng nhập
					</button>

					{/* <div className="forgot-password">
						<Link to="/forgot-password">Quên mật khẩu?</Link>
					</div>

					<div className="register-prompt">
						<p>Chưa có tài khoản? hãy đăng ký để trở thành khách hàng thân thiết</p>
						<Link to="/register" className="register-link">
							Đăng ký {icons.arrowRight}
						</Link>
					</div> */}
				</div>

				<div className="flex-space" />
			</div>
		</AuthLayout>
	);
}
