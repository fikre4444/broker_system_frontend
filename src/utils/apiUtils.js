//needed details
import axios from 'axios';
import { toast } from 'react-toastify';
import { sleep } from './otherUtils';

const sendApiRequest = async ({
  url,
  requestBody = {},
  method = 'GET',
  startMessage = 'Processing...',
  token = null,
  successMessage = 'Operation completed successfully!',
  errorMessage = 'An error occurred while processing!',
  successDuration = 2000, // Duration for success message
  errorDuration = 2000,   // Duration for error message
  onSuccess = () => {},
  onError = () => {},
  onFinally = () => {},
  sleepLength = 0
}) => {
  const toastId = toast.loading(startMessage, { closeButton: true });
  await sleep(sleepLength);
  try {
    const config = {
      method,
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...(method !== 'GET' && { data: requestBody }),  // Only include data for non-GET requests
    };

    const response = await axios(config);

    if (response.status === 200) {
      toast.update(toastId, {
        render: successMessage,
        type: 'success',
        isLoading: false,
        autoClose: successDuration,
      });
      onSuccess(response);
    }
  } catch (error) {
    console.error(error);
    toast.update(toastId, {
      render: errorMessage,
      type: 'error',
      isLoading: false,
      autoClose: errorDuration,
    });
    onError(error);
  } finally {
    onFinally();
  }
};


export default sendApiRequest;


//how to use it example
// await sendApiRequest({
//   url: `/api/head-coordinator/apply-internships?department=${department}`,
//   method: 'POST',
//   startMessage: "Processing Students and Internships...",
//   token, // pass the token to automatically include in headers
//   successMessage: "Successfully processed Applications",
//   errorMessage: "There was an error while processing!",
//   onSuccess: (response) => {
//     console.log(response.data.temporaryPlacementsEssentials);
//     setGotTemporaryPlacementResults(true);
//     setTemporaryPlacements(response.data.temporaryPlacements);
//   },
//   onError: (error) => console.log(error),
//   onFinally: () => setIsAssigningStudents(false)
// });