import { FaRegFilePdf } from 'react-icons/fa';
import Link from 'next/link';
import {Header} from '../../../components/Header';
import {Footer} from '../../../components/Footer';
import { Container } from '../../../components/Container';

const Page = () => {
  return (
    <div className=" ">
      <Header />
      <main className="h-1/2  flex flex-col items-center justify-center h-screen">
      <h1 className='font-bold'>Financial Statement
</h1>
      <Container className="flex items-center sm:w-1/2 sm:m-3 mt-4 border border-green-500 rounded p-3 cursor-pointer">
  <FaRegFilePdf className="mr-2" />
  <div>
    <Link href='https://drive.google.com/uc?export=download&id=1hhbeMv9xkCgPZtvp71q8mhrq0da5WQQ-'>UPIA ANNUAL REPORT & FINANCIAL STATEMENTS ENDED 30TH JUNE 2023</Link>
  </div>
</Container>

      </main>
      <Footer />
    </div>
  );
};

export default Page;
