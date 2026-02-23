import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Level-up AI. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors">
              소개
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors">
              문의하기
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-blue-600 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-blue-600 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
