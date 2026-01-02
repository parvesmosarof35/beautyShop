'use server';

import { revalidateTag } from 'next/cache';

// ... existing code ...
export async function revalidateFeaturedProducts() {
  revalidateTag('featured-products');
}

export async function revalidateFaq() {
  revalidateTag('faq');
}

export async function revalidateBlog() {
  revalidateTag('blog');
}

export async function revalidatePrivacy() {
  revalidateTag('privacy');
}

export async function revalidateTerms() {
  revalidateTag('termsAndConditions');
}

export async function revalidateAbout() {
  revalidateTag('aboutUs');
}

export async function revalidateProducts() {
  revalidateTag('product');
}
