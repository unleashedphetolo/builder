export default function Section({ section }) {
  const c = section.content;

  switch (section.type) {
    case "hero":
      return <h1>{c.title}</h1>;

    case "gallery":
      return c.images.map((img, i) => (
        <img key={i} src={img} />
      ));

    case "contact":
      return <p>{c.email}</p>;

    default:
      return null;
  }
}
