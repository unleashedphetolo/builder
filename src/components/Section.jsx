import AnimatedWrapper from "./AnimatedWrapper";
import EditableText from "./EditableText";

export default function Section({ section }) {
  const c = section.content;

  let content;

  switch (section.type) {
    case "hero":
      content = <EditableText section={section} />;
      break;

    case "image":
      content = <img src={c.image} />;
      break;

    default:
      content = null;
  }

  return (
    <AnimatedWrapper animation={section.animation}>
      {content}
    </AnimatedWrapper>
  );
}


// export default function Section({ section }) {
//   const c = section.content;

//   switch (section.type) {
//     case "hero":
//       return <h1>{c.title}</h1>;

//     case "gallery":
//       return c.images.map((img, i) => (
//         <img key={i} src={img} />
//       ));

//     case "contact":
//       return <p>{c.email}</p>;

//     default:
//       return null;
//   }
// }

