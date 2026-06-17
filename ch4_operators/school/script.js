function findSchool() {
  const age = Number(document.getElementById("ageInput").value);
  const result = document.getElementById("result");

  let school = "";

  // OR operator ||
  if (age < 0 || age > 100) {
    school = "❌ Please enter a valid age.";
  }

  // AND operator &&
  else if (age >= 2 && age <= 4) {
    school = "🧸 Nursery School";
  } else if (age >= 5 && age <= 10) {
    school = "📚 Primary School";
  } else if (age >= 11 && age <= 16) {
    school = "🏫 Secondary School (GCSE)";
  }

  // Demonstrating OR operator again
  else if (age === 17 || age === 18) {
    school = "🎯 Sixth Form / College (A-Levels)";
  } else if (age >= 19 && age <= 24) {
    school = "🎓 University";
  } else if (age < 2) {
    school = "👶 Too young for school.";
  } else {
    school = "🎓 Adult education or postgraduate study.";
  }

  result.innerHTML = school;
}
