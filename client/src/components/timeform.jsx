/* eslint-disable react/prop-types */


const Timeform = ({time}) => {
    const milliseconds = (time.seconds * 1000) + (time.nanoseconds / 1e6);

    // Create a Date object
    const date = new Date(milliseconds);
  
    // Format the date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  
    return (
     <>{formattedDate}</>
        
    );
}

export default Timeform;
