
import { PublisherProvider } from "../context/publisherContext";
import { AuthorProvider } from "../context/authorContext";
import { CategoryProvider } from "../context/categoryContext";
import { BookProvider } from "../context/bookContext";
import { BorrowingProvider } from "../context/borrowingContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
  return (
    <PublisherProvider>
      <AuthorProvider>
        <CategoryProvider>
          <BookProvider>
            <BorrowingProvider>
              {/* Toast'lar için */}
              <Toaster position="top-right" />
              {children}
            </BorrowingProvider>
          </BookProvider>
        </CategoryProvider>
      </AuthorProvider>
    </PublisherProvider>
  );
}
