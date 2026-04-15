import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../Utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector.JSX';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../Utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();
//handle SingUp form Submit
  const handleSignUp = async (e) => { 
    e.preventDefault();

    let profileImageUrl ="";

    if(!fullName){
      setError("Please enter your name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return;
    }

    setError("");

    //SignUp API Call
    try {

      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl
      });

      const {token, user} = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black '>Tạo tài khoản</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Nhập thông tin bên dưới để tham gia ngay hôm nay
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setfullName(target.value)}
              label="Họ và tên"
              placeholder="Jean"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Địa chỉ email"
              placeholder="join@example.com"
              type="text"
            ></Input>
            <div className='col-span-2'>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Mật khẩu"
                placeholder="Tối thiểu 8 ký tự"
                type="password"
              ></Input>
            </div>


          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>Đăng Ký</button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Tài khoản sẵn sàng? {""}
            <Link className='font-medium text-primary underline' to="/login">Đăng Nhập</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp