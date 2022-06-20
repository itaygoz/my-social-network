export function   makeFormatDate(date) {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };

    return new Intl.DateTimeFormat("default", options).format(new Date(date));
  }