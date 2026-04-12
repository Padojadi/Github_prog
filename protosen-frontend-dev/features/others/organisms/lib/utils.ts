function translateOrganismStatus(status: string) {
  switch (status) {
    case "active":
      return "Actif";
    default:
      return status;
  }
}
export { translateOrganismStatus };
