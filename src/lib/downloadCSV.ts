export const handleDownloadCSV = () => {
  const link = document.createElement("a");
  link.href = "/unclean.csv"; // Path to the file in the public directory
  link.download = "example_csv.csv"; // Name of the file to be downloaded
  link.click();
};
