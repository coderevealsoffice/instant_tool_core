import prisma from '../src/lib/prisma/client'
import { blog1 } from './blogs/blog1'
import { blog2 } from './blogs/blog2'
import { blog3 } from './blogs/blog3'
import { blog4 } from './blogs/blog4'
import { blog5 } from './blogs/blog5'

const blogs = [blog1, blog2, blog3, blog4, blog5];

async function main() {
  console.log("Starting to seed FULL LENGTH (1500w) blog categories and posts...");

  // 1. Upsert Categories
  const categoriesToCreate = ["Education", "Business", "Creators", "Technology"];
  const categoryMap = new Map();

  for (const name of categoriesToCreate) {
    const slug = name.toLowerCase();
    const category = await prisma.blogCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    });
    categoryMap.set(name, category.id);
    console.log(`✅ Ensured category: ${name}`);
  }

  // 2. Upsert Blogs
  for (const blog of blogs) {
    const categoryId = categoryMap.get(blog.categoryName) || null;
    
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        image: blog.image,
        metaTitle: blog.metaTitle,
        metaDesc: blog.metaDesc,
        isPublished: true,
        categoryId: categoryId,
      },
      create: {
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author,
        image: blog.image,
        metaTitle: blog.metaTitle,
        metaDesc: blog.metaDesc,
        isPublished: true,
        categoryId: categoryId,
      }
    });
    console.log(`✅ Seeded long-form blog: ${blog.title}`);
  }

  console.log("🎉 All long-form blogs successfully seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding blogs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
