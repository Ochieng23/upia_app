import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Create the client
export const client = createClient({
  projectId: '0vj5jzrn',
  dataset: 'production',
  apiVersion: '2024-03-06',
  useCdn: false,
})

// Create an image URL builder using the client
const builder = imageUrlBuilder(client)

// Export a function to generate URLs for images
export const urlFor = (source) => {
  return builder.image(source)
}

//   export async function PostIndex() {
//     const posts = await client.fetch(`*[_type == "post"]`);

//     return {
//       props: {
//         posts,
//       },
//     };
//   }
