import React, { useState, useEffect } from 'react'
import logo from "../../Assests/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import { NavbarLinks } from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { TiShoppingCart } from 'react-icons/ti'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { categories } from '../../Services/apis'
import { apiconnector } from '../../Services/apiconnector'
import { useDispatch } from 'react-redux'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineClose } from 'react-icons/ai'
import { HiSearch } from 'react-icons/hi'
import { BsChevronDown } from 'react-icons/bs'
import { useNavigate } from 'react-router'

const NavBar = ({ setProgress }) => {
    const dispatch = useDispatch();

    const { token } = useSelector(state => state.auth);
    const { user } = useSelector(state => state.profile);
    const { totalItems } = useSelector(state => state.cart);
    const [searchValue, setSearchValue] = useState("")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [catalogExpanded, setCatalogExpanded] = useState(false);
    const navigate = useNavigate();

    const location = useLocation()
    const matchRoutes = (routes) => {
        return matchPath({ path: routes }, location.pathname)
    }

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname])

    const [sublinks, setSublinks] = useState([]);
    const fetchSublinks = async () => {
        try {
            const result = await apiconnector("GET", categories.CATEGORIES_API);
            if (result?.data?.data?.length > 0) {
                setSublinks(result?.data?.data);
            }
            localStorage.setItem("sublinks", JSON.stringify(result.data.data));
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchSublinks();
    }, [])

    const handelSearch = (e) => {
        e.preventDefault();
        if (searchValue?.length > 0) {
            navigate(`/search/${searchValue}`);
            setSearchValue("");
            setMobileMenuOpen(false);
        }
    }

    return (
        <div className="flex bg-richblack-900 w-screen relative z-50 h-14 items-center justify-center border-b-[1px] border-b-richblack-700 transition-all duration-500">
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

                {/* Logo */}
                <Link to='/' onClick={() => { dispatch(setProgress(100)) }}>
                    <img src={logo} width={160} alt="Study Notion" height={42} />
                </Link>

                {/* ===== Mobile: cart + hamburger ===== */}
                <div className='flex lg:hidden items-center gap-3'>
                    {user && user?.accountType !== "Instructor" && (
                        <Link to='/dashboard/cart' className='relative' onClick={() => { dispatch(setProgress(100)) }}>
                            <TiShoppingCart className='fill-richblack-25 w-7 h-7' />
                            {totalItems > 0 && (
                                <span className='font-medium text-[10px] bg-yellow-100 text-richblack-900 rounded-full px-[4px] absolute -top-[4px] -right-[4px]'>
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className='text-richblack-25 p-1'
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen
                            ? <AiOutlineClose className='w-6 h-6' />
                            : <GiHamburgerMenu className='w-6 h-6' />
                        }
                    </button>
                </div>

                {/* ===== Mobile Overlay ===== */}
                {mobileMenuOpen && (
                    <div
                        className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* ===== Mobile Drawer ===== */}
                <div className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-[260px] bg-richblack-800 border-r border-richblack-700 overflow-y-auto transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className='flex flex-col p-5 gap-4'>

                        {/* Auth */}
                        {token == null ? (
                            <div className='flex flex-col gap-3'>
                                <Link to='/login' onClick={() => { dispatch(setProgress(100)); setMobileMenuOpen(false) }}>
                                    <button className='w-full text-center text-[15px] px-6 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200'>
                                        Login
                                    </button>
                                </Link>
                                <Link to='/signup' onClick={() => { dispatch(setProgress(100)); setMobileMenuOpen(false) }}>
                                    <button className='w-full text-center text-[15px] px-5 py-2 rounded-md font-semibold bg-richblack-700 text-richblack-5 border border-richblack-600 hover:scale-95 transition-all duration-200'>
                                        Signup
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <p className='text-richblack-400 text-xs uppercase tracking-widest mb-2'>Account</p>
                                <ProfileDropDown />
                            </div>
                        )}

                        <div className='h-[1px] bg-richblack-700 w-full' />

                        {/* Search */}
                        <form onSubmit={handelSearch} className='flex items-center gap-2 bg-richblack-700 rounded-full px-3 py-2'>
                            <HiSearch className='text-richblack-300 flex-shrink-0' size={16} />
                            <input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                type="text"
                                placeholder="Search courses..."
                                className='bg-transparent text-richblack-5 text-sm focus:outline-none w-full placeholder:text-richblack-400'
                            />
                        </form>

                        <div className='h-[1px] bg-richblack-700 w-full' />

                        {/* Nav Links */}
                        <div className='flex flex-col gap-1'>
                            <p className='text-richblack-400 text-xs uppercase tracking-widest mb-1'>Menu</p>
                            {NavbarLinks?.map((element, index) => (
                                element.title === "Catalog" ? (
                                    <div key={index}>
                                        <div 
                                            className='flex items-center justify-between text-richblack-5 font-medium py-2 px-2 cursor-pointer select-none'
                                            onClick={() => setCatalogExpanded(!catalogExpanded)}
                                        >
                                            <p>Catalog</p>
                                            <BsChevronDown className={`transition-transform duration-200 ${catalogExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                        <div className={`flex flex-col pl-4 overflow-hidden transition-all duration-300 ${catalogExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {sublinks?.map((el, i) => (
                                                <Link
                                                    key={i}
                                                    to={`/catalog/${el?.name.split(" ").join("-").toLowerCase()}`}
                                                    onClick={() => { dispatch(setProgress(30)); setMobileMenuOpen(false) }}
                                                    className='text-richblack-300 text-sm py-1.5 hover:text-richblack-5 transition-colors block cursor-pointer select-none'
                                                >
                                                    {el?.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={index}
                                        to={element?.path}
                                        onClick={() => { dispatch(setProgress(100)); setMobileMenuOpen(false) }}
                                        className={`py-2 px-2 rounded-md text-sm font-medium transition-colors ${matchRoutes(element?.path) ? 'text-yellow-25 bg-richblack-700' : 'text-richblack-5 hover:bg-richblack-700'}`}
                                    >
                                        {element?.title}
                                    </Link>
                                )
                            ))}
                        </div>

                    </div>
                </div>

                {/* ===== Desktop Nav Links ===== */}
                <nav className='hidden lg:block'>
                    <ul className='flex flex-row gap-x-6 text-richblack-25 items-center'>
                        {NavbarLinks?.map((element, index) => (
                            <li key={index}>
                                {element.title === "Catalog" ? (
                                    <div className='flex items-center group relative cursor-pointer'>
                                        <p>{element.title}</p>
                                        <svg width="25px" height="20px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.384"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#ffffff"></path></g></svg>
                                        <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]'>
                                            <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'></div>
                                            {sublinks?.length > 0 && sublinks?.map((el, i) => (
                                                <Link to={`/catalog/${el?.name.split(" ").join("-").toLowerCase()}`} key={i} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" onClick={() => { dispatch(setProgress(30)) }}>
                                                    <p>{el?.name}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={element?.path} onClick={() => { dispatch(setProgress(100)) }}>
                                        <p className={`${matchRoutes(element?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                            {element?.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}

                        {/* Desktop Search */}
                        <form onSubmit={handelSearch} className='flex items-center relative'>
                            <input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                id='searchinput'
                                type="text"
                                placeholder="Search"
                                className='border-0 focus:ring-1 ring-richblack-400 rounded-full px-2 py-1 text-[15px] w-28 text-richblack-50 focus:outline-none focus:border-transparent bg-richblack-700'
                            />
                            <HiSearch type='submit' id='searchicon' size={20} className="text-richblack-100 top-1 absolute cursor-pointer left-20" />
                        </form>
                    </ul>
                </nav>

                {/* ===== Desktop Auth Buttons ===== */}
                <div className='flex-row gap-5 hidden lg:flex items-center'>
                    {user && user?.accountType !== "Instructor" && (
                        <Link to='/dashboard/cart' className='relative px-4' onClick={() => { dispatch(setProgress(100)) }}>
                            <TiShoppingCart className='fill-richblack-25 w-7 h-7' />
                            {totalItems > 0 && (
                                <span className='shadow-sm shadow-black text-[10px] font-bold bg-yellow-100 text-richblack-900 rounded-full px-1 absolute -top-[2px] right-[8px]'>
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token == null && (
                        <Link to='/login' className='text-richblack-25' onClick={() => { dispatch(setProgress(100)) }}>
                            <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[7px] text-richblack-100'>
                                Login
                            </button>
                        </Link>
                    )}
                    {token == null && (
                        <Link to='/signup' className='text-richblack-25' onClick={() => { dispatch(setProgress(100)) }}>
                            <button className='rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[7px] text-richblack-100'>
                                Signup
                            </button>
                        </Link>
                    )}
                    {token !== null && (
                        <div className='pt-2'>
                            <ProfileDropDown />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default NavBar