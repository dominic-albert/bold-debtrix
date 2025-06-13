import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  color: z.string().min(1, 'Please select a color'),
});

export const uxDebtSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  screen: z.string().min(1, 'Screen/Component is required').max(100, 'Screen name too long'),
  type: z.enum(['Heuristic', 'Accessibility', 'Performance', 'Visual', 'Usability']),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Open', 'In Progress', 'Resolved']),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  recommendation: z.string().min(1, 'Recommendation is required').max(1000, 'Recommendation too long'),
  assignee: z.string().optional(),
  figmaUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type UXDebtFormData = z.infer<typeof uxDebtSchema>;