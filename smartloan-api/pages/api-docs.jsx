import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <>
      <Head>
        <title>SmartLoan API Docs</title>
      </Head>
      <SwaggerUI url="/api/swagger" persistAuthorization={true} />
    </>
  );
}
