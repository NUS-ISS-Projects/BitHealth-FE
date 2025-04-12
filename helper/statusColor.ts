import colors from "../app/theme/colors";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "#FFA726";
    case "CONFIRMED":
      return "#4CAF50";
    case "CANCELLED":
      return "#9E9E9E";
    case "REJECTED":
      return "#D32F2F";
    case "COMPLETED":
      return "#009688";
    default:
      return colors.primary;
  }
};
