import { NextResponse } from 'next/server';

interface DemographicsData {
  ageGroups: Record<string, number>;
  gender: Record<string, number>;
  interests: Record<string, number>;
  education: Record<string, number>;
  occupation: Record<string, number>;
  income: Record<string, number>;
  maritalStatus: Record<string, number>;
}

export async function GET() {
  try {
    // Data dummy yang realistis untuk Indonesia
    const demographics: DemographicsData = {
      ageGroups: {
        '18-24': 25,
        '25-34': 35,
        '35-44': 20,
        '45-54': 15,
        '55+': 5
      },
      gender: {
        'male': 55,
        'female': 40,
        'other': 5
      },
      interests: {
        'Technology': 40,
        'Business': 30,
        'Education': 25,
        'Health': 20,
        'Entertainment': 35
      },
      education: {
        'High School': 30,
        'Bachelor': 45,
        'Master': 20,
        'PhD': 5
      },
      occupation: {
        'Student': 25,
        'Professional': 40,
        'Business Owner': 15,
        'Employee': 20
      },
      income: {
        'Low': 30,
        'Medium': 45,
        'High': 25
      },
      maritalStatus: {
        'Single': 40,
        'Married': 45,
        'Divorced': 10,
        'Widowed': 5
      }
    };

    return NextResponse.json(demographics);
  } catch (error) {
    console.error('Error getting demographics:', error);
    return NextResponse.json({
      ageGroups: {},
      gender: {},
      interests: {},
      education: {},
      occupation: {},
      income: {},
      maritalStatus: {}
    });
  }
} 