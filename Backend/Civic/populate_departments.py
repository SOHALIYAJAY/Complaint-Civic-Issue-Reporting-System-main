from departments.models import Department

departments_data = [
    {
        'name': 'Roads & Infrastructure Department',
        'category': 'ROADS',
        'description': 'Responsible for road maintenance, repairs, and infrastructure development',
        'contact_email': 'roads@civic.gov.in',
        'contact_phone': '1800-111-001'
    },
    {
        'name': 'Traffic & Road Safety Department',
        'category': 'TRAFFIC',
        'description': 'Managing traffic flow, road safety, and traffic signal maintenance',
        'contact_email': 'traffic@civic.gov.in',
        'contact_phone': '1800-111-002'
    },
    {
        'name': 'Water Supply Department',
        'category': 'WATER',
        'description': 'Ensuring clean water supply and managing water distribution systems',
        'contact_email': 'water@civic.gov.in',
        'contact_phone': '1800-111-003'
    },
    {
        'name': 'Sewerage & Drainage Department',
        'category': 'SEWERAGE',
        'description': 'Maintaining sewerage systems and drainage infrastructure',
        'contact_email': 'sewerage@civic.gov.in',
        'contact_phone': '1800-111-004'
    },
    {
        'name': 'Sanitation & Garbage Department',
        'category': 'SANITATION',
        'description': 'Waste management, garbage collection, and sanitation services',
        'contact_email': 'sanitation@civic.gov.in',
        'contact_phone': '1800-111-005'
    },
    {
        'name': 'Street Lighting Department',
        'category': 'LIGHTING',
        'description': 'Installation and maintenance of street lights and public lighting',
        'contact_email': 'lighting@civic.gov.in',
        'contact_phone': '1800-111-006'
    },
    {
        'name': 'Parks & Public Spaces Department',
        'category': 'PARKS',
        'description': 'Maintenance of parks, gardens, and public recreational spaces',
        'contact_email': 'parks@civic.gov.in',
        'contact_phone': '1800-111-007'
    },
    {
        'name': 'Animal Control Department',
        'category': 'ANIMALS',
        'description': 'Managing stray animals and animal welfare programs',
        'contact_email': 'animals@civic.gov.in',
        'contact_phone': '1800-111-008'
    },
    {
        'name': 'Building Control Department',
        'category': 'ILLEGAL_CONSTRUCTION',
        'description': 'Monitoring construction activities and preventing illegal constructions',
        'contact_email': 'building@civic.gov.in',
        'contact_phone': '1800-111-009'
    },
    {
        'name': 'Encroachment Department',
        'category': 'ENCROACHMENT',
        'description': 'Removing encroachments and protecting public spaces',
        'contact_email': 'encroachment@civic.gov.in',
        'contact_phone': '1800-111-010'
    },
    {
        'name': 'Public Property Department',
        'category': 'PROPERTY_DAMAGE',
        'description': 'Maintaining and protecting public property and assets',
        'contact_email': 'property@civic.gov.in',
        'contact_phone': '1800-111-011'
    },
    {
        'name': 'Electricity Department',
        'category': 'ELECTRICITY',
        'description': 'Managing power supply and electrical infrastructure',
        'contact_email': 'electricity@civic.gov.in',
        'contact_phone': '1800-111-012'
    }
]

# Ensure `name` uses the category code for each department (e.g. 'ROADS')
for d in departments_data:
    d['name'] = d['category']

for dept_data in departments_data:
    dept, created = Department.objects.get_or_create(
        category=dept_data['category'],
        defaults=dept_data
    )
    if created:
        print(f"Created: {dept.name}")
    else:
        print(f"Already exists: {dept.name}")

print(f"\nTotal departments: {Department.objects.count()}")
