import react, { useEffect, useState } from 'react';


function Footer() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('users') || localStorage.getItem('admin')) {
            setIsAuth(true);
        }
    }, [])
    return (
        <footer className="footer mt-auto py-1 bg-none text-center">
            <div className="container fs-15 f-w-l f-white">
                <i className="bi bi-telephone"></i><span>&nbsp;+91 9876 543 210 &nbsp;</span>
                <i className="bi bi-envelope"></i> <span> &nbsp;dummy@email.com&nbsp;</span>

            </div>
        </footer>
    )

}

export default Footer;