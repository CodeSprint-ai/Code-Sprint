// components/Header.jsx

import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/">
                    <p className="text-2xl font-bold text-gray-800">
                        Next<span className="text-purple-600">Land</span>
                    </p>
                </Link>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li>
                            <Link href="#">
                                <p className="text-gray-600 hover:text-purple-600 transition-colors">Features</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="register">
                                <p className="text-gray-600 hover:text-purple-600 transition-colors">Sign Up</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="login" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                               Log In
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}