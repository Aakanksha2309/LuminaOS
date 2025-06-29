'use client'

import { Document, Page } from 'react-pdf';
import { useState, useEffect } from 'react';

const PdfViewer = ({ pdfDataUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!isClient) {
    return <div>Loading PDF viewer...</div>;
  }

  return (
    <div>
      <Document file={pdfDataUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <div>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button disabled={pageNumber <= 1} onClick={() => setPageNumber((prevPageNumber) => prevPageNumber - 1)}>
          Previous
        </button>
        <button disabled={pageNumber >= numPages} onClick={() => setPageNumber((prevPageNumber) => prevPageNumber + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
