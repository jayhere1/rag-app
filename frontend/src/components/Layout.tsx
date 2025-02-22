import '@mantine/core/styles.css'
import { AppShell, Title, UnstyledButton, Group, rem, Button, Box, Image, Collapse } from '@mantine/core'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import LoginModal from './LoginModal'
import IndexModal from './IndexModal'
import { IconChevronDown } from '@tabler/icons-react'

export default function Layout() {
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // State for collapsible sections
  const [productionOpened, setProductionOpened] = useState(true)
  const [workforceOpened, setWorkforceOpened] = useState(false)
  const [businessOpened, setBusinessOpened] = useState(false)
  const [safetyOpened, setSafetyOpened] = useState(false)

  const isActive = (path: string) => location.pathname.startsWith(path)

  const NavSection = ({ 
    label, 
    opened, 
    onToggle,
    children 
  }: { 
    label: string; 
    opened: boolean; 
    onToggle: () => void;
    children?: React.ReactNode;
  }) => (
    <Box mb={rem(8)}>
      <UnstyledButton
        style={{
          display: 'flex',
          width: '100%',
          padding: rem(12),
          color: 'white',
          fontFamily: 'Inter, system-ui, sans-serif',
          backgroundColor: opened ? 'rgba(255,255,255,0.1)' : 'transparent',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
        onClick={onToggle}
      >
        <span>{label}</span>
        <IconChevronDown
          size={16}
          style={{
            transform: opened ? 'rotate(180deg)' : 'none',
            transition: 'transform 200ms ease',
          }}
        />
      </UnstyledButton>
      <Collapse in={opened}>
        <Box 
          pl={rem(16)} 
          mt={rem(4)}
          style={{
            borderLeft: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  )

  const NavButton = ({ label }: { label: string }) => (
    <UnstyledButton
      style={{
        display: 'block',
        width: '100%',
        padding: rem(10),
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.9rem',
        backgroundColor: 'transparent',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        marginBottom: rem(2),
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white'
        }
      }}
    >
      {label}
    </UnstyledButton>
  )

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 280, breakpoint: 'sm' }}
      padding={0}
      style={{
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AppShell.Header p='xs' style={{ backgroundColor: '#1A1B1E', borderBottom: '1px solid #2c2e33' }}>
        <Group h="100%" style={{ justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          <Title 
            order={3} 
            style={{ 
              color: 'white', 
              fontFamily: 'Inter, system-ui, sans-serif',
              margin: 0,
              minWidth: 'fit-content'
            }}
          >
            Manufacturing GPT
          </Title>
          
          <Group style={{ flex: 1, justifyContent: 'center', gap: '2rem' }}>
            <Button 
              variant="transparent"
              onClick={() => navigate('/')}
              style={{ 
                color: '#E9ECEF',
                padding: '0 12px',
                fontSize: '1rem',
                fontWeight: 'normal'
              }}
            >
              Chat
            </Button>
            <Button 
              variant="transparent"
              onClick={() => navigate('/query')}
              style={{ 
                color: '#E9ECEF',
                padding: '0 12px',
                fontSize: '1rem',
                fontWeight: 'normal'
              }}
            >
              Ask a question
            </Button>
          </Group>

          <Group style={{ gap: '1rem', minWidth: 'fit-content' }}>
            {user?.roles.includes('admin') && (
              <Button
                variant="subtle"
                color="gray"
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  backgroundColor: isActive('/indexes') ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
              >
                Indexes
              </Button>
            )}
            {user ? (
              <Button 
                onClick={logout}
                variant="filled"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  borderRadius: '4px',
                  fontWeight: 500
                }}
              >
                Logout
              </Button>
            ) : (
              <Button 
                onClick={() => setLoginModalOpened(true)}
                variant="filled"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  borderRadius: '4px',
                  fontWeight: 500
                }}
              >
                Login
              </Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs" style={{ top: 0, backgroundColor: '#1e3a8a', minHeight: '100vh', height: '100%' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
            <Image 
              src="/logo.png"
              alt="Logo"
              width={19}
              height={19}
              fit="contain"
              style={{
                opacity: 0.9
              }}
            />
          </Box>
          <NavSection label="Production & Operations" opened={productionOpened} onToggle={() => setProductionOpened(!productionOpened)}>
            <NavButton label="Predictive Maintenance" />
            <NavButton label="Process Management" />
            <NavButton label="Process Automation" />
          </NavSection>

          <NavSection label="Workforce Management" opened={workforceOpened} onToggle={() => setWorkforceOpened(!workforceOpened)}>
            <NavButton label="Resource Management" />
            <NavButton label="Training Programs" />
          </NavSection>

          <NavSection label="Business Development" opened={businessOpened} onToggle={() => setBusinessOpened(!businessOpened)}>
            <NavButton label="Documentation" />
          </NavSection>

          <NavSection label="Safety & Compliance" opened={safetyOpened} onToggle={() => setSafetyOpened(!safetyOpened)}>
            <NavButton label="Safety Management" />
          </NavSection>

        </Box>
      </AppShell.Navbar>

      <AppShell.Main style={{ 
        height: 'calc(100vh - 60px)',
        overflow: 'auto',
        backgroundColor: '#f5f5f5'  // Light grey background
      }}>
        <Outlet />
      </AppShell.Main>

      <LoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />

      <IndexModal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          navigate('/');
        }}
      />
    </AppShell>
  )
}
